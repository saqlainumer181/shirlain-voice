import uuid
from typing import Dict, List, Optional

import openai
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams

from app.config import settings


class QdrantService:
    def __init__(self):
        self.client = QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT)
        self.collection_name = settings.QDRANT_COLLECTION
        self.embedding_model = "text-embedding-ada-002"

        # Create collection if not exists
        self._ensure_collection()

    def _ensure_collection(self):
        """Ensure the collection exists"""
        collections = self.client.get_collections().collections

        if not any(col.name == self.collection_name for col in collections):
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=1536, distance=Distance.COSINE  # OpenAI embedding dimension
                ),
            )

    def _get_embedding(self, text: str) -> List[float]:
        """Get embedding for text using OpenAI"""
        response = openai.embeddings.create(model=self.embedding_model, input=text)
        return response.data[0].embedding

    async def upload_restaurant_info(self, content: Dict) -> int:
        """Upload restaurant information to Qdrant"""
        points = []

        # Process different sections of the restaurant info
        for section_name, section_content in content.items():
            if isinstance(section_content, dict):
                for key, value in section_content.items():
                    text = f"{section_name} - {key}: {value}"
                    embedding = self._get_embedding(text)

                    point = PointStruct(
                        id=str(uuid.uuid4()),
                        vector=embedding,
                        payload={
                            "section": section_name,
                            "key": key,
                            "content": str(value),
                            "full_text": text,
                        },
                    )
                    points.append(point)
            elif isinstance(section_content, list):
                for item in section_content:
                    text = f"{section_name}: {item}"
                    embedding = self._get_embedding(text)

                    point = PointStruct(
                        id=str(uuid.uuid4()),
                        vector=embedding,
                        payload={
                            "section": section_name,
                            "content": str(item),
                            "full_text": text,
                        },
                    )
                    points.append(point)
            else:
                text = f"{section_name}: {section_content}"
                embedding = self._get_embedding(text)

                point = PointStruct(
                    id=str(uuid.uuid4()),
                    vector=embedding,
                    payload={
                        "section": section_name,
                        "content": str(section_content),
                        "full_text": text,
                    },
                )
                points.append(point)

        # Upload to Qdrant
        self.client.upsert(collection_name=self.collection_name, points=points)

        return len(points)

    async def search_restaurant_info(self, query: str, limit: int = 3) -> List[Dict]:
        """Search for relevant restaurant information"""
        query_embedding = self._get_embedding(query)

        results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_embedding,
            limit=limit,
        )

        return [
            {"content": result.payload["full_text"], "score": result.score}
            for result in results
        ]

    async def get_context_for_query(self, query: str) -> Optional[str]:
        """Get relevant context for a query"""
        results = await self.search_restaurant_info(query)

        if results:
            context = "\n".join([r["content"] for r in results])
            return context

        return None
