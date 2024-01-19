class ScaleReportError(Exception):
    "Scale Report Error"


class NoScaleResponseFound(ScaleReportError):
    """
        This particular scale has no scale response. 
    """

class NoScaleDataFound(ScaleReportError):
    """
        Scale has no scale_data
    """


class NoScaleType(ScaleReportError):
    """
        Scale type has no scale type
    """

class ScaleSettingsFetchError(ScaleReportError):
    """
        Can't fetch Scale Settings. 
    """


