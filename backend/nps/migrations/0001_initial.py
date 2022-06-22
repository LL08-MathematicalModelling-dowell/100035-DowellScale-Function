# Generated by Django 4.0.5 on 2022-06-22 10:23

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='response',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.IntegerField()),
                ('category', models.CharField(blank=True, max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='score_response',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.IntegerField()),
                ('category', models.CharField(blank=True, max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='system_settings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('direction', models.CharField(choices=[('horizontal', 'horizontal'), ('vertical', 'vertical')], max_length=10)),
                ('color', models.BooleanField(default=False)),
                ('hex_color', models.CharField(blank=True, max_length=20)),
                ('timing', models.BooleanField(default=False)),
                ('time', models.IntegerField(blank=True)),
                ('label', models.CharField(choices=[('text', 'text'), ('image', 'image')], max_length=10)),
                ('labelA', models.CharField(blank=True, max_length=50)),
                ('labelB', models.CharField(blank=True, max_length=50)),
                ('scale_limit', models.IntegerField(blank=True, default=10)),
                ('spacing_unit', models.IntegerField(blank=True, default=1)),
                ('scale', models.JSONField(blank=True)),
                ('labels', models.CharField(blank=True, max_length=1000)),
            ],
        ),
    ]
