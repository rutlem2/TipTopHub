# Generated by Django 4.1.5 on 2023-01-19 05:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_product_cart_item'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='cart_item',
        ),
        migrations.AddField(
            model_name='cartitem',
            name='product',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.product'),
        ),
    ]
