import requests
import json

class Capture:
    def __init__(self):
        pass

    id = ""

    def response(self, flow):
        if (
            flow.request.url == "http://reso-online-ddos.soli-reso.com:9001/api/"
            and "method=station.goods_info" in flow.request.content.decode("utf-8")
        ):
            goods_info = flow.response.text
            self.post_goods_info(goods_info)

    #     if (
    #         flow.request.url == "http://reso-online-ddos.soli-reso.com:9001/api/"
    #         and "method=station.arrive" in flow.request.content.decode("utf-8")
    #     ):
    #         arrive_info = flow.response.text
    #         self.post_arrive_info(arrive_info)

    # def post_arrive_info(self, arrive_info):
    #     url = "http://resonance-helper.rughzenhaide.com/api/user"
    #     headers = {"Content-Type": "application/json"}
    #     response = requests.post(url, json=arrive_info, headers=headers)
    #     if response.ok:
    #         print("Successfully posted user info to resonance-helper")
    #     else:
    #         print(response)
    #         print("Failed to post user info to resonance-helper.")

    def post_goods_info(self, goods_info):
        url = "http://resonance-helper.rughzenhaide.com/api/all"
        # url = "http://localhost:3000/api/all"
        headers = {"Content-Type": "application/json"}
        response = requests.post(url, json=goods_info, headers=headers)
        if response.ok:
            print("Successfully posted goods info to resonance-helper.")
        else:
            print(response)
            print("Failed to post goods info to resonance-helper")

addons = [Capture()]