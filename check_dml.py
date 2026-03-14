import torch_directml
print(f"DirectML available: {torch_directml.is_available()}")
device_count = torch_directml.device_count()
print(f"Device count: {device_count}")
for i in range(device_count):
    print(f"Device {i}: {torch_directml.device_name(i)}")
