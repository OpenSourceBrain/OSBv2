from setuptools import setup, find_packages

REQUIREMENTS = [
    'jupyterhub-kubespawner',
    'cloudharness'
]

setup(
    name='osb_jupyter',
    version='0.1',
    packages=find_packages(exclude=["*.tests", "*.tests.*", "tests.*", "tests"]),
    url='',
    license='MIT',
    install_requires=REQUIREMENTS,
    author='Zoran Sinnema',
    author_email='zoran@metacell.us',
    description='Utilities to integrate OSB functionalities with Jupyter applications'
)
