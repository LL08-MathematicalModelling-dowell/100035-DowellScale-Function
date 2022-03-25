from django.contrib import admin
from .models import Product, NpsScaleModel, NpsScaleSetting, nps_scores

# Register your models here.
#admin.site.register(SomeModel)
admin.site.register(Product)
admin.site.register(NpsScaleModel)
admin.site.register(NpsScaleSetting)
admin.site.register(nps_scores)