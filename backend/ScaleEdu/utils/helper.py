from datetime import datetime, timedelta
def get_date_range(period):
    now = datetime.utcnow()
    if period == 'seven_days':
        start_date = now - timedelta(days=7)
    elif period == 'one_month':
        start_date = now - timedelta(days=30)
    elif period == 'one_year':
        start_date = now - timedelta(days=90)
    elif period == 'custom':
        start_date = now - timedelta(days=30)
    else:
        raise ValueError("Invalid time period")
    return start_date.isoformat(), now.isoformat()