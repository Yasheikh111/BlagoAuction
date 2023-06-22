from liqpay import LiqPay

liqpay = LiqPay(public_key, private_key)
res = liqpay.api("request", {
    "action"         : "p2pcredit",
    "version"        : "3",
    "amount"         : "1",
    "currency"       : "USD",
    "description"    : "description text",
    "order_id"       : "order_id_1",
    "receiver_card"  : "4731195301524633",
    "receiver_last_name"  : "LastName",
    "receiver_first_name" : "FirstName"
})