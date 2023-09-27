import workspaces.persistence.crud_persistence as repos


def get_class_attr(Cls):
    import re

    return [
        a
        for a, v in Cls.__dict__.items()
        if not re.match("<function.*?>", str(v))
        and not re.match("<classmethod.*?>", str(v))
        and not (a.startswith("__") and a.endswith("__"))
    ]


def get_class_attr_val(cls):
    attr = get_class_attr(type(cls))
    attr_dict = {}
    for a in attr:
        attr_dict[a] = getattr(cls, a)
    return attr_dict





