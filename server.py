#!/usr/bin/env python

"""
    Pinr
    ~~~~
    A Flask-based web app where you can post and share images, text and links.
"""

# imports
from flask import Flask, render_template, request, abort, jsonify
import pymongo, bson, json
from datetime import datetime
from urllib2 import urlopen

#### App
app = Flask(__name__)


#### URLs for serving web pages
@app.route('/')
def index():
    return render_template('index.html')

### get items
@app.route('/items')
def get_items():
    c = pymongo.Connection()
    try:
    	data = []
    	for item in list(c.pinr.items.find()):
        	item['date'] = item['date'].isoformat()
        	item['_id'] = str(item['_id'])
        	data.append(item)
    	return jsonify({'items': data})
    except KeyError:
	abort(400)
    finally:
	c.disconnect()

### add items
@app.route('/items', methods=['POST'])
def add_item():
    c = pymongo.Connection()
    try:
        item = request.json
        if item == None:
            json.loads(request.data)
        item['date'] = datetime.now()
        item['ip_addr'] = request.remote_addr
 	item_id = c.pinr.items.insert(item)

	# Make ID and Date JSON Serializable
        item['_id'] = str(item_id)
        item['date'] = item['date'].isoformat()
        return jsonify({'items': item})
    finally:
        c.disconnect()

### delete items
@app.route('/item/<item_id>', methods=["DELETE"])
def delete_item(item_id):
    c = pymongo.Connection()
    try:
        c.pinr.items.remove({'_id': bson.ObjectId(item_id)})
        return "OK"
    except bson.errors.InvalidId:
        abort(400)
    finally:
        c.disconnect()
            
###E Validators

### share items
@app.route('/item/<item_id>', methods=["PUT"])
def share_item(item_id):
    ip_addr = request.json['ip_addr']
    urlopen("http://"+ip_addr+"/items", json.dumps({"item": "foo"}))
    return "OK"

#### Server initialization
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
