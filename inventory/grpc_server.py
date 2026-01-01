from concurrent import futures
from src.repositories.stock_repository import InventoryRepository
from src.services.inventory_service import InventoryService
from src.config.aws_config import dynamodb
from  src.generated.inventory.v1 import inventory_pb2_grpc
import grpc


def serve():
    repo = InventoryRepository(dynamodb)

    service_impl = InventoryService(repo)

    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    inventory_pb2_grpc.add_InventoryServiceServicer_to_server(service_impl, server)

    server.add_insecure_port("[::]:50051")
    print("Inventory Service started on port 50051...")
    server.start()
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
