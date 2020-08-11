from cloudharness.service import pvc
def create_persistent_volume_claim(name, size, logger):
    pvc.create_persistent_volume_claim(name, size, logger)
