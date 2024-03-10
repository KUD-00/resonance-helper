import requests
import json

class Capture:
    def __init__(self):
        pass

    def response(self, flow):
        if (
            flow.request.url == "http://reso-online-ddos.soli-reso.com:9001/api/"
            and "method=station.goods_info" in flow.request.content.decode("utf-8")
        ):
            goods_info_json = eval(flow.response.content.decode("utf-8"))
            goods_info = json.loads(goods_info_json)
            self.post_goods_info(goods_info)

    def post_goods_info(self, goods_info):
        url = "http://resonance-helper.rughzenhaide.com/api/all"
        headers = {"Content-Type": "application/json"}
        response = requests.post(url, json=goods_info, headers=headers)
        if response.ok:
            print("Goods info posted successfully to your website.")
        else:
            print("Failed to post goods info to your website.")

addons = [Capture()]