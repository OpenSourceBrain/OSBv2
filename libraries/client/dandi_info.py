from dandi.dandiapi import DandiAPIClient
import json

# Initialize client
client = DandiAPIClient()

dandiset_ids = []
ds = client.get_dandisets()
for d in ds:
    dandiset_ids.append(d.identifier)
all_info = []

min_index = 0
max_index = 50000


index = min_index

for dandiset_id in dandiset_ids[min_index:max_index]:
    # Get a specific Dandiset
    dandiset = client.get_dandiset(dandiset_id, "draft")

    print(
        "Looking at %i: %s (https://dandiarchive.org/dandiset/%s)"
        % (index, dandiset, str(dandiset).replace("DANDI:", ""))
    )
    index += 1
    metadata = dandiset.get_raw_metadata()
    print("  %s" % (metadata["name"]))
    info = {}
    for k in metadata:
        v = metadata[k]
        # print(f"  - {k}: {v}")
        info[k] = v

    assets = list(dandiset.get_assets())
    print("  Number of assets: %i" % len(assets))
    info["num_files"] = int(metadata["assetsSummary"]["numberOfFiles"])

    if info["num_files"] > 0:
        if (
            "species" in metadata["assetsSummary"]
            and len(metadata["assetsSummary"]["species"]) > 0
        ):
            info["species"] = metadata["assetsSummary"]["species"][0]["name"]
        else:
            info["species"] = ""

        if (
            "dataStandard" in metadata["assetsSummary"]
            and len(metadata["assetsSummary"]["species"]) > 0
        ):
            info["data_type"] = metadata["assetsSummary"]["dataStandard"][0]["name"]
        else:
            info["data_type"] = "???"

        all_info.append(info)
    else:
        print("  No files in this Dandiset")

filename = "cached_info/dandishowcase_info2.json"

strj = json.dumps(all_info, indent="    ", sort_keys=True)
with open(filename, "w") as fp:
    fp.write(strj)

print("Data on DANDI (%i models) written to %s" % (len(all_info), filename))

"""
    # List assets
    assets = list(dandiset.get_assets())

    # Get a specific asset
    asset = dandiset.get_asset_by_path("path/to/file.nwb")

    # Download an asset
    asset.download("local_file.nwb")
    """
