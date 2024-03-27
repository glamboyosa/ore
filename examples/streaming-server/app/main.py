import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import time
app = FastAPI()


origins = [
   "*"
]



app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

def chunk_text(text: str, chunk_size=50):
    """Generator function to chunk text into smaller parts."""
    for i in range(0, len(text), chunk_size):
        yield text[i:i + chunk_size]
        time.sleep(0.2)

@app.get("/")
async def root():
    celsius_temp = 20
    fahrenheit_temp = (celsius_temp * 9/5) + 32
    description = f"The {celsius_temp} degrees Celsius may seem cool, but it's equivalent to a toasty {fahrenheit_temp} degrees Fahrenheit! Whether you're enjoying a brisk autumn day or cozying up by the fireplace in winter, this temperature conversion highlights the versatility of weather measurement systems. Understanding both Celsius and Fahrenheit allows for seamless communication across international borders and scientific disciplines. So whether you're planning a trip abroad or simply checking the weather forecast, knowing how to convert between Celsius and Fahrenheit is an invaluable skill in today's interconnected world."
    print(description)
    return StreamingResponse(chunk_text(description, 2), headers={ "Content-Type": "text/event-stream" })

@app.get("/server-component")
async def root():
    server_name = "DataCenter_Server"
    cpu_cores = 32
    ram_gb = 128
    description = f"Server components are cool and The {server_name} is a powerhouse in terms of performance and reliability. With a staggering {cpu_cores} CPU cores and {ram_gb}GB of RAM, it is capable of handling even the most demanding workloads with ease. Whether you're running complex simulations, hosting virtual machines, or managing large-scale databases, this server delivers unmatched speed and efficiency. Its robust design ensures maximum uptime, keeping your operations running smoothly around the clock. Invest in the {server_name} today and experience unparalleled computing power for your business."

    return StreamingResponse(chunk_text(description), headers={ "Content-Type": "text/event-stream" })