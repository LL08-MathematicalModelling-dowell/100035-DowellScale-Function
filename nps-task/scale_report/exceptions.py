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



# Datacube Related Exceptions

class DatacubeError(Exception):
    """Base class for all Datacube errors"""


class ConnectionError(DatacubeError):
    """Error when connecting to the Datacube"""


class DatabaseError(DatacubeError):
    """Error related to the Datacube database connection"""


class DatabaseNotFoundError(DatabaseError):
    """Database connection requested was not found"""


class CollectionNotFoundError(DatabaseError):
    """Database collection requested was not found"""


class AlreadyExistsError(DatabaseError):
    """Database collection requested already exists"""

