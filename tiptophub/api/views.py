from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests
from . import food_constants as fc
import config

ENDPOINT = 'https://api.yelp.com/v3/businesses/search'
DEFAULT_RADIUS_METERS = 4023
DEFAULT_RESULTS_RETURNED = 5

@api_view(['PUT'])
def fetch_restaurants(request):
    data = request.data
    zipcode_param = data['zip']
    radius_param = data['rad']

    url = ENDPOINT
    headers = {
        'Authorization': 'Bearer %s' % config.API_KEY,
    }
    url_params = {
        'term': 'restaurants',
        'location': zipcode_param,
        'radius': radius_param,
        'sort_by': 'rating',
        'limit': 5,
    }

    response = requests.get(url, headers=headers, params=url_params)
    
    return Response(response.json())

@api_view(['PUT'])
def fetch_foods(request):
    foods = fc.categories_to_foods(request.data)

    return Response(foods)

@api_view(['GET'])
def get_routes(request):
    routes = [
        {
            'Endpoint': '/notes/',
            'method': 'GET',
            'body': None,
            'description': 'Returns an array of notes'
        },
        {
            'Endpoint': '/notes/id',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single note object'
        },
        {
            'Endpoint': '/notes/create/',
            'method': 'POST',
            'body': {'body': ""},
            'description': 'Creates new note with data sent in post request'
        },
        {
            'Endpoint': '/notes/id/update/',
            'method': 'PUT',
            'body': {'body': ""},
            'description': 'Creates an existing note with data sent in post request'
        },
        {
            'Endpoint': '/notes/id/delete/',
            'method': 'DELETE',
            'body': None,
            'description': 'Deletes and exiting note'
        },
    ]
    return Response(routes)

@api_view(['GET'])
def get_zip_restaurants(request):
    restaurants = [
        {
            'name': 'Lemongrass & Lime Thai Bistro - Vistas',
            'rank': '1',
            'categories': ['thai', 'salad', 'noodles'],
            'open': False 
        },
        {
            'name': 'BabyStack Cafe - Red Rock',
            'rank': '2',
            'categories': ['breakfast_brunch', 'newamerican', 'filipino'],
            'open': False

        },
        {
            'name': 'China A Gogo',
            'rank': '3',
            'categories': ['chinese'],
            'open': True
        },
        {
            'name': 'John Cutter',
            'rank': '4',
            'categories': ['newamerican', 'vegan', 'vegetarian'],
            'open': True
        },
    ]

    return Response(restaurants)