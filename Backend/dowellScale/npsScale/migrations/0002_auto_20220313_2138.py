# Generated by Django 3.2.12 on 2022-03-13 20:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('npsScale', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='nps_scores',
            name='timer',
            field=models.CharField(default='Default Time', max_length=100),
        ),
        migrations.AlterField(
            model_name='nps_scores',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='nps_scores',
            name='name',
            field=models.CharField(default='Innovation', max_length=100),
        ),
    ]