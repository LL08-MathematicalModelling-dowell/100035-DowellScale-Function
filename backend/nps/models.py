from django.db import models



class system_settings(models.Model):
    DIRECTIONS = (
        ('horizontal', 'horizontal'),
        ('vertical', 'vertical')
    )
    LABELS = (
        ("text","text"),
        ("image","image")
    )
    direction = models.CharField(max_length=10, choices=DIRECTIONS)
    color = models.BooleanField(default=False)
    hex_color = models.CharField(max_length=20, blank=True)
    timing = models.BooleanField(default=False)
    time = models.IntegerField(blank=True)
    label = models.CharField(choices=LABELS, max_length=10)
    labelA = models.CharField(max_length=50, blank=True)
    labelB = models.CharField(max_length=50, blank=True)
    scale_limit = models.IntegerField(default=10, blank=True)
    spacing_unit = models.IntegerField(default=1,blank=True)
    scale = models.JSONField(blank=True)
    labels = models.CharField(blank=True,max_length=1000)

    def __str__(self):
        return f"{self.id}"

    def save(self, *args, **kwargs):
        scale = []
        for i in range(0,self.scale_limit+1):
            scale.append(i)
        self.scale = {'scale': scale}
        if self.label == "image":
            self.labels = f"{scale[0]}=\U0001F642 {scale[-1]}=\U0001F642"
        else:
            self.labels = f"{scale[0]}= Won't Recommend {scale[-1]}=Highly Recommend"
        super(system_settings, self).save(*args, **kwargs)


class response(models.Model):
    score = models.IntegerField()
    category = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f'{self.id}'

    def save(self, *args, **kwargs):
        if self.score <= 6:
            self.category = "Detractor"
        elif self.score <= 8:
            self.category = "Neutral"
        else:
            self.category = "Promoter"
        super(response, self).save(*args, **kwargs)
