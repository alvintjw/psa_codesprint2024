import os
import httpx
from dotenv import load_dotenv

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

headers = {
    "apikey": supabase_key,
    "Authorization": f"Bearer {supabase_key}",
    "Content-Type": "application/json",
}


# Make supabase_request async and handle empty responses
async def supabase_request(url, method="GET", data=None):
    async with httpx.AsyncClient() as client:
        try:
            if method == "GET":
                response = await client.get(url, headers=headers)
            elif method == "POST":
                response = await client.post(url, headers=headers, json=data)
            elif method == "PATCH":
                response = await client.patch(url, headers=headers, json=data)
            elif method == "DELETE":
                response = await client.delete(url, headers=headers)

            response.raise_for_status()

            try:
                return response.json()
            except ValueError:
                print("Empty or invalid JSON response from Supabase.")
                return {"success": True}
        except httpx.HTTPStatusError as e:
            print(f"HTTP Error: {e.response.text}")
            return None
        except httpx.RequestError as e:
            print(f"Network Error: {e}")
            return None
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            return None


def validate_user_data(user_data):
    required_fields = ["user_id", "first_name", "username"]
    for field in required_fields:
        if field not in user_data or not user_data[field]:
            raise ValueError(f"Missing required field: {field}")


async def create_user(user_data):
    validate_user_data(user_data)

    url = f"{supabase_url}/rest/v1/User"
    data = {
        "user_id": user_data["user_id"],
        "first_name": user_data["first_name"],
        "username": user_data["username"],
    }

    response = await supabase_request(url, method="POST", data=data)

    if response:
        print(f"User created successfully: {response}")
    else:
        print(f"Failed to create user.")
    return response


async def create_query(query_data):
    url = f"{supabase_url}/rest/v1/RecommendationRequest"
    data = {"username": query_data["username"], "query_text": query_data["query_text"]}

    print(
        f"Creating query for user with username: {query_data['username']}, query_text: {query_data['query_text']}"
    )

    response = await supabase_request(url, method="POST", data=data)

    if response:
        print(f"Query created successfully: {response}")
    else:
        print(f"Failed to create query.")

    return response


async def create_judging_request(judging_request_data):
    url = f"{supabase_url}/rest/v1/JudgingRequest"
    data = {"username": judging_request_data["username"], "wine_name": judging_request_data["wine_name"]}

    print(
        f"Creating query for user with username: {judging_request_data['username']}, wine_name: {judging_request_data['wine_name']}"
    )

    response = await supabase_request(url, method="POST", data=data)

    if response:
        print(f"Judging Request created successfully: {response}")
    else:
        print(f"Failed to create judging request.")

    return response


async def create_generated_recommendation(generated_recommendation_data):
    url = f"{supabase_url}/rest/v1/GeneratedRecommendation"
    data = {
        "username": generated_recommendation_data["username"],
        "wine_name": generated_recommendation_data["wine_name"],
        "recommendation_text": generated_recommendation_data["recommendation_text"],
        "price": generated_recommendation_data["price"],
        "link": generated_recommendation_data["link"],
    }

    response = await supabase_request(url, method="POST", data=data)

    if response:
        print(f"Judging Request created successfully: {response}")
    else:
        print(f"Failed to create judging request.")

    return response

async def create_generated_rating(generated_rating_data):
    url = f"{supabase_url}/rest/v1/GeneratedWineRating"
    data = {
        "username": generated_rating_data["username"],
        "wine_name": generated_rating_data["wine_name"],
        "review_text": generated_rating_data["review_text"],
        "rating": generated_rating_data["rating"],
    }

    response = await supabase_request(url, method="POST", data=data)

    if response:
        print(f"Judging Request created successfully: {response}")
    else:
        print(f"Failed to create judging request.")

    return response


# Make user_exists async
async def user_exists(user_id):
    url = f"{supabase_url}/rest/v1/User?user_id=eq.{user_id}"

    print(f"Checking if user exists with ID: {user_id}")

    response = await supabase_request(url)

    if response and len(response) > 0:
        print(f"User found with ID: {user_id}")
        return True
    else:
        print(f"User not found with ID: {user_id}")
        return False
