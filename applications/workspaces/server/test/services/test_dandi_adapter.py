from workspaces.service.osbrepository.adapters.dandiadapter import DandiAdapter
from workspaces.models import OSBRepository


def test_resources():
    repo = OSBRepository(id=1, name="Allen",
                         uri="https://gui.dandiarchive.org/#/dandiset/000107")
    adapter = DandiAdapter(repo)

    contexts = adapter.get_contexts()
    assert contexts

    resources = adapter.get_resources(contexts[0])

    assert resources
