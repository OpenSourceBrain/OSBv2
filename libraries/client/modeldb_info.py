"""
Script to get info on all models on ModelDB via their API, and potentially
add forks of the ModelDB GitHub repos on github.com/OpenSourceBrain
"""

import sys
import json
import pprint

from utils import get_github

verbose = True  #
verbose = False

info = {}
with_gitrepo = 0

fork_if_missing = "-fork" in sys.argv

gh = get_github()

known_to_have_other_forks = [2730, 3343, 3658]
known_no_mdb_github_repo = [2018003, 2018022, 2016219, 2016662, 2017005, 2018268]
empty_on_mdb_github = [2014825]

many_forks = []
to_be_forked = []
ignored = []
errors = []
on_osbv2 = []
forked_now = []

if __name__ == "__main__":
    min_index = 0
    max_index = 10000
    index = 0

    from osb.utils import get_page

    models_json = get_page("https://modeldb.science/api/v1/models")

    models = json.loads(models_json)
    pprint.pprint(models, compact=True)

    selection = models[min_index:max_index]

    for model in selection:
        print(
            "\n--------   Model (%i/%i, order %i): %s:\n"
            % (index, len(selection), index + min_index, model)
        )

        info[model] = json.loads(
            get_page("https://modeldb.science/api/v1/models/%s" % model)
        )

        print("    %s" % info[model]["name"])
        if "gitrepo" in info[model] and info[model]["gitrepo"]:
            with_gitrepo += 1
            print("    gitrepo: %s" % info[model]["gitrepo"])
        else:
            print("    gitrepo: %s" % False)

        expected_forks = 0
        possible_mdb_repo = "ModelDBRepository/%s" % (info[model]["id"])
        try:
            mdb_repo = gh.get_repo(possible_mdb_repo)

            repo_to_use = mdb_repo
            print(
                "    Exists at: %s (def branch: %s; forks: %i)"
                % (mdb_repo.html_url, mdb_repo.default_branch, mdb_repo.forks)
            )

            possible_osbgh_repo = "OpenSourceBrain/%s" % (info[model]["id"])
            try:
                osb_repo = gh.get_repo(possible_osbgh_repo)
                msg = "    Exists at: %s (def branch: %s; forks: %i), order %i" % (
                    osb_repo.html_url,
                    osb_repo.default_branch,
                    osb_repo.forks,
                    index + min_index,
                )
                on_osbv2.append(msg)
                print(msg)
                repo_to_use = osb_repo
                expected_forks += 1

                info[model]["osbv2_gh_repo"] = repo_to_use.html_url
                info[model]["osbv2_gh_branch"] = repo_to_use.default_branch
            except Exception:
                if info[model]["id"] in empty_on_mdb_github:
                    info_ = (
                        f"    Ignoring {possible_mdb_repo} as it is known to be empty"
                    )
                    print(info_)
                    ignored.append(info_)

                else:
                    print(
                        "    **** Missing fork: %s, forking now: %s"
                        % (possible_osbgh_repo, fork_if_missing)
                    )
                    if fork_if_missing:
                        print("    Forking to: %s..." % possible_osbgh_repo)
                        org = gh.get_organization("OpenSourceBrain")
                        org.create_fork(mdb_repo, default_branch_only=False)
                        msg = "    Forked to: %s..." % possible_osbgh_repo
                        print(msg)
                        forked_now.append(msg)

                    else:
                        msg = "    Yet to be forked: %i, order %i; %s" % (
                            info[model]["id"],
                            index + min_index,
                            info[model]["name"],
                        )
                        print(msg)
                        to_be_forked.append(msg)

            if (not mdb_repo.forks == expected_forks) and (
                info[model]["id"] not in known_to_have_other_forks
            ):
                msg = "    Unexpected forks for %i (%s != %s)..." % (
                    info[model]["id"],
                    mdb_repo.forks,
                    expected_forks,
                )
                print(msg)
                many_forks.append(msg)

        except Exception as e:
            if info[model]["id"] in known_no_mdb_github_repo:
                info_ = f"    Ignoring {possible_mdb_repo} as it is known to have no ModelDB GitHub repo"
                print(info_)
                ignored.append(info_)
            else:
                msg = "    Problem with model: %i (%i/%i) %s (%s)" % (
                    info[model]["id"],
                    index,
                    len(selection),
                    info[model]["name"],
                    possible_mdb_repo,
                )
                print(msg)
                print(e)
                errors.append(msg)

        index += 1

    if verbose:
        infop = pprint.pprint(info, compact=True)

    print("\nThere were %i models checked\n" % (len(info)))

    filename = "cached_info/modeldb.json"

    print(
        "\n+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
        + "\n\nDone!"
    )

    print("\nAll on osb (%i total):" % len(on_osbv2))
    for m in on_osbv2:
        print(m)

    print("\nJust forked (%i total):" % len(forked_now))
    for m in forked_now:
        print(m)

    info[0] = {}
    info[0]["to_be_forked"] = []
    info[0]["errors"] = []
    info[0]["ignored"] = []

    print("\nStill to be forked (%i total):" % len(to_be_forked))
    for m in to_be_forked:
        print(m)
        info[0]["to_be_forked"].append(m.strip())

    print("\nMany forks (%i total):" % len(many_forks))
    for m in many_forks:
        print(m)

    print("\nErrors (%i total):" % len(errors))
    for m in errors:
        print(m)
        info[0]["errors"].append(m.strip())

    print("\nIgnored (%i total):" % len(ignored))
    for m in ignored:
        print(m)
        info[0]["ignored"].append(m.strip())

    strj = json.dumps(info, indent="    ", sort_keys=True)
    with open(filename, "w") as fp:
        fp.write(strj)

    print("Data on ModelDB (%i models) written to %s" % (len(info), filename))
