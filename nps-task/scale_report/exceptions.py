class NoScaleResponseFound(Exception):
    """
        This particular scale has no scale response. 
    """

class NoScaleDataFound(Exception):
    """
        Scale has no scale_data
    """


class NoScaleType(Exception):
    """
        Scale type has no scale type
    """

class ScaleSettingsFetchError(Exception):
    """
        Can't fetch Scale Settings. 
    """


