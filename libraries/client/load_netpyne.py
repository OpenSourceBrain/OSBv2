# Loads NetPyNE model info...

import csv

missing_osbv2 = []

with open("netpyne-web/NetPyNE - Models.csv", newline="") as csvfile:
    reader = csv.DictReader(csvfile)
    count = 2
    for row in reader:
        print("===============================")
        print("%i: %s" % (count, row["Title"]))
        if len(row["Link to model on OSB"]) == 0:
            missing_osbv2.append(row["Link to model repository"])
            print("      Model link: %s" % (row["Link to model repository"]))
            print("      OSBv2 link: %s" % (row["Link to model on OSB"]))
        print()
        count += 1


print("\nAll missing OSBv2 link (%i total):" % len(missing_osbv2))
for m in missing_osbv2:
    print("    %s" % m)
