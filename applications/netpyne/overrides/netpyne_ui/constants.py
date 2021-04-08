import os

UPLOAD_FOLDER_NAME = 'uploads'
NETPYNE_WORKDIR = '..'

ALLOWED_EXTENSIONS = ["py", "zip", "gz", ".tar.gz",
                      "pdf", "txt", "xls", "png", "jpeg", "hoc"]
NETPYNE_WORKDIR_PATH = os.path.dirname(os.getcwd())
UPLOAD_FOLDER_PATH = os.path.join(NETPYNE_WORKDIR_PATH, UPLOAD_FOLDER_NAME)


if not os.path.exists(UPLOAD_FOLDER_PATH):
    os.makedirs(UPLOAD_FOLDER_PATH)

if not os.path.exists(NETPYNE_WORKDIR_PATH):
    os.makedirs(NETPYNE_WORKDIR_PATH)
