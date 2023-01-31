import pytest
import os
from workspaces.service.osbrepository.adapters.dandiadapter import DandiAdapter
from workspaces.models import OSBRepository
import responses
from responses import _recorder

HERE = os.path.dirname(os.path.realpath(__file__))

os.environ["CH_VALUES_PATH"] = os.path.join(os.path.dirname(HERE), "values.yaml")
resp_file = os.path.join(HERE, "dandi.toml")


@_recorder.record(file_path=resp_file)
def record_resources():
    repo = OSBRepository(id=1, name="Allen",
                         uri="https://gui.dandiarchive.org/#/dandiset/000029")
    adapter = DandiAdapter(repo)

    contexts = adapter.get_contexts()
    assert contexts

    resources = adapter.get_resources(contexts[0])

@responses.activate
def test_resources():
    responses._add_from_file(file_path=resp_file)
    repo = OSBRepository(id=1, name="Allen",
                         uri="https://gui.dandiarchive.org/dandiset/000029")
    adapter = DandiAdapter(repo)

    contexts = adapter.get_contexts()
    assert contexts

    resources = adapter.get_resources(contexts[0])

    assert resources
    assert len(resources.children) == 4
    assert resources.children[0].resource
    assert resources.children[0].resource.name == "sub-anm369962"
    assert len(resources.children[0].children) == 1
    assert resources.children[0].children[0].resource.name == "sub-anm369962_behavior+ecephys.nwb"
    assert resources.children[0].children[0].resource.path


if __name__ == "__main__":
    record_resources()