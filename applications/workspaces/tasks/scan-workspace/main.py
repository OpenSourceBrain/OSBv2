import os
import sys
import shutil

from cloudharness import log as logger
from cloudharness.workflows.utils import notify_queue

assert len(sys.argv) > 3, 'Not all arguments not specified. Cannot notify queue. Usage: [shared directory] [workspace id] [queue name]'



folder = sys.argv[1].split(":")[1]
workspace_id = sys.argv[2]
queue = sys.argv[3]

USER_LINK_NAME = "my-shared"


try:
    os.symlink("/opt/user", os.path.join(folder, USER_LINK_NAME))
except:
    pass

if not os.path.exists(os.path.join(folder, "README.md")):   
    shutil.copy("README.md", os.path.join(folder, "README.md"))

logger.info(f"Scanning folder: {folder}, workspace id: {workspace_id}, queue: {queue}")

# notify_queue(queue, message)
resources = []
for root, dirs, files in os.walk(folder):
    if ".ipynb_checkpoints" in root:
        continue
    for file in files:
        full_file_name = os.path.join(root, file)
        filename, file_extension = os.path.splitext(full_file_name)
        if file_extension.lower() in (".nwb", ".npjson", ".ipynb"):
            logger.info(f"Found resource: {full_file_name}")
            
            resources.append(full_file_name)

payload = {
    "workspace_id": workspace_id,
    "resources": resources
}

notify_queue(queue, payload)

os.system(f"chown -R 1000:100 {folder}")