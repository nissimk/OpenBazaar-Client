var Backbone = require('backbone'),
    backboneLinear = require('backbone.linear'),
    getBTPrice = require('../utils/getBitcoinPrice');

module.exports = Backbone.LinearModel.extend({
  flatOptions : {delimiter: "__"},
  defaults: {
    displayPrice: 0, //set locally, not by server
    venderBTCPrice: 0, //set locally, not by server
    userCurrencyCode: "", //set locally, not by server
    itemBuyable: true, //set locally, not by server
    itemHash: "", //set locally, not by server
    images: [], //array of uploaded images to be sent to the server
    combinedImagesArray: [], //tracks uploaded and old images

    vendor_offer__signature: "",
    vendor_offer__listing__shipping__shipping_regions: [
        "UNITED_STATES"
      ],
    vendor_offer__listing__shipping__est_delivery__international: "N/A",
    vendor_offer__listing__shipping__est_delivery__domestic: "N/A",
    vendor_offer__listing__shipping__shipping_origin: "UNITED_STATES",
    vendor_offer__listing__shipping__free: true,
    vendor_offer__listing__item__category: "None",
    vendor_offer__listing__item__sku: "0",
    vendor_offer__listing__item__description: "None",

    vendor_offer__listing__item__price_per_unit__fiat__price: 0,
    vendor_offer__listing__item__price_per_unit__fiat__currency_code: "usd",
    vendor_offer__listing__item__title: "New Item",
    vendor_offer__listing__item__process_time: "0",
    vendor_offer__listing__item__image_hashes: [],
    vendor_offer__listing__item__nsfw: false,
    vendor_offer__listing__item__keywords: [],
    vendor_offer__listing__item__condition: "New",
    vendor_offer__listing__moderators: [],
    vendor_offer__listing__policy__terms_conditions: "None",
    vendor_offer__listing__policy__returns: "None",
    vendor_offer__listing__metadata__category: "None",
    vendor_offer__listing__metadata__version: "",
    vendor_offer__listing__metadata__category_sub: "",
    vendor_offer__listing__metadata__expiry: "",
  },

    /*
    "vendor_offer": {
      "signature": "",
        "listing": {
          "shipping": {
            "shipping_regions": [
              "UNITED_STATES"
            ],
            "est_delivery": {
            "international": "N/A",
            "domestic": "3-5 Business Days"
            },
            "shipping_origin": "UNITED_STATES",
            "free": true
          },
          "item": {
            "category": "None",
                "sku": "0",
                "description": "None",
                "price_per_unit": {
              "fiat": {
                "price": 0,
                "currency_code": "usd"
              }
            },
            "title": "New Item",
                "process_time": "0",
                "image_hashes": [],
                "nsfw": false,
                "keywords": [],
                "condition": "New"
          },
          "moderators": [
            {
              "pubkeys": {
                "encryption": {
                  "key": "",
                  "signature": ""
                },
                "signing": {
                  "key": "",
                  "signature": ""
                },
                "bitcoin": {
                  "key": "",
                  "signature": ""
                }
              },
              "guid": "",
              "blockchain_id": ""
            }
          ],
              "policy": {
            "terms_conditions": "None",
                "returns": "None"
          },
          "id": {
            "pubkeys": {
              "guid": "",
                  "bitcoin": ""
            },
            "guid": "",
                "blockchain_id": ""
          },
          "metadata": {
            "category": "None",
                "version": "",
                "category_sub": "",
                "expiry": ""
          }
      }
    }
  },*/
/*
  parse: function(response){
    response.vendor_offer = response.vendor_offer || {};
    response.vendor_offer.listing = response.vendor_offer.listing || {};
    //make sure item exists
    response.vendor_offer.listing.item = response.vendor_offer.listing.item || {
          "category": "None",
          "sku": "0",
          "description": "None",
          "price_per_unit": {
            "fiat": {
              "price": 0,
              "currency_code": "usd"
            }
          },
          "title": "New Item",
          "process_time": "0",
          "image_hashes": [],
          "nsfw": false,
          "keywords": [],
          "condition": "New"
        };
    //make sure shipping exists
    response.vendor_offer.listing.shipping = response.vendor_offer.listing.shipping || {
          "flat_fee": {
            "fiat": {
              "price": {
                "international": "0",
                "domestic": "0"
              },
              "currency_code": "usd"
            }
          },
          "shipping_regions": [
            ""
          ],
          "est_delivery": {
            "international": "",
            "domestic": ""
          },
          "shipping_origin": "",
          "free": false
        };
    return response;
  },
*/
  initialize: function(){
    //this.updateAttributes();
    this.on('change', this.updateAttributes, this);
  },

  updateAttributes: function(){
    var self = this;
    var vendorPrice = this.get("vendor_offer__listing__item__price_per_unit__fiat__price") ? Number(this.get("vendor_offer__listing__item__price_per_unit__fiat__price")) : 0;
    if(vendorPrice && this.get("userCurrencyCode")){
      var vendorCCode = (this.get('vendor_offer__listing__item__price_per_unit__fiat__currency_code')).toUpperCase();
      var vendorBitCoinRatio = 0;
      var vendorBitCoinPrice = 0;
      if (vendorCCode !== "BTC"){
        getBTPrice(vendorCCode, function (btAve) {
          vendorBitCoinRatio = btAve;
          vendorBitCoinPrice = Number((vendorPrice/btAve).toFixed(4));
          var vendToUserBTCRatio = window.currentBitcoin/vendorBitCoinRatio;
          var newAttributes = {};
          newAttributes.venderBTCPrice = vendorBitCoinPrice;
          newAttributes.displayPrice = new Intl.NumberFormat(window.lang, {
            style: 'currency',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            currency: self.get("userCurrencyCode")
          }).format(vendorPrice*vendToUserBTCRatio);
          newAttributes.itemBuyable = true;
          self.set(newAttributes);
        });
      }else{
        vendorBitCoinRatio = 1;
        vendorBitCoinPrice = vendorPrice;
      }
      this.set({itemBuyable: true});
    }else if(vendorPrice === 0){
      this.set({itemBuyable: false});
    }else{
      this.set({itemBuyable: false});
    }
  }
});