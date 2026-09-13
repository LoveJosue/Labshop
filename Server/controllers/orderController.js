import Order from '../models/orderModel.js';
import Client from '../models/clientModel.js'
import { sendMail } from '../services/mailer.js';

export async function placeOrder(req, res, next) {
    try {
        const order = req.body;
        const orderClient = order.client;
        const userLocality = req.headers["accept-language"]?.split(",")[0] || "fr-TG";
        const mailTemplate = 'orderConfirmationMail';

        // Client rattaché : compte connecté > client existant (par email) > nouveau client visiteur
        let client = req.user?.clientId
            ?? await Client.findOne({ email: orderClient.email });
        if (!client) {
            client = await createVisitorClient(orderClient);
        }

        const newOrder = await createOrder(order, client);
        const context = {...newOrder.toObject(), userLocality: userLocality}
        const email = context.clientInfos.email;
        const mailObject = `Confirmation de votre commande ${newOrder.orderNumber}`;
        // La commande est déjà enregistrée : un SMTP en panne ne doit pas la faire échouer.
        try {
            await sendMail(email, mailObject, mailTemplate, context, { withBrandLogo: true });
        } catch (mailErr) {
            console.error(`Échec de l'envoi du mail de confirmation ${newOrder.orderNumber} :`, mailErr.message);
        }
        return res.status(201).json({ orderNumber: newOrder.orderNumber });
    } catch (err) {
        // En cas d'erreur faire un roll back de toutes les transactions faites dans la BD avant
        console.error(err);
        next(err); // Laisser passer à un middlewawe d'erreur
    }
}
async function createVisitorClient(orderClient) {
    const newClient = await Client.create({
        name: orderClient.name,
        prename: orderClient.prename,
        phone: orderClient.phone,
        email: orderClient.email,
        dateCreation: Date.now()
    });
    return newClient;
}
async function createOrder(order, client) {
    const orderData = {}; // objet vide que tu remplis graduellement

    orderData.clientId = client._id;
    orderData.clientInfos = {
        name: order.client.name,
        prename: order.client.prename,
        phone: order.client.phone,
        email: order.client.email
    };

    orderData.payment = {
        cardNumber: order.payment.cardNumber,
        cardOwner: order.payment.cardOwner,
        cardCvv: order.payment.cardCvv,
        cardExpiration: order.payment.cardExpiration
    };

    orderData.billing = {
        address: order.billing.address,
        country: order.billing.country,
        city: order.billing.city,
        postalCode: order.billing.postalCode,
        name: order.billing.name,
        prename: order.billing.prename,
        phone: order.billing.phone
    };
    
    if (order.billing.location) {
        orderData.billing.location = {
            latitude: order.billing?.location?.latitude ?? '',
            longitude: order.billing?.location?.longitude ?? ''
        }
    }

    if (order.expedition) {
        orderData.expedition = {
            address: order.expedition.address,
            country: order.expedition.country,
            city: order.expedition.city,
            postalCode: order.expedition.postalCode,
            name: order.expedition.name,
            prename: order.expedition.prename,
            phone: order.expedition.phone
        };
        if (order.expedition.location) {
            orderData.expedition.location = {
                latitude: order.expedition?.location?.latitude ?? '',
                longitude: order.expedition?.location?.longitude ?? ''
            }
        }
    }
    
    if (order.pickup) {
        orderData.pickup = {
            storeName: order.pickup.storeName,
            address: order.pickup.address,
        };
        if (order.pickup.location) {
            orderData.pickup.location = {
                latitude: order.pickup?.location?.latitude,
                longitude: order.pickup?.location?.longitude
            }
        }
    }

    if (order.expedition) {
        orderData.expeditionCosts = order.expeditionCosts;
    }

    // Champs communs
    orderData.orderDate = Date.now();
    orderData.statut = "en attente";
    orderData.items = order.items || [];
    orderData.subTotal = order.subTotal || 0;
    orderData.tva = order.TVA || 0;
    orderData.totalWithTVA = order.totalWithTVA || 0;

    const newOrder = await Order.create(orderData);
    return newOrder;
}

export async function getOrderByNumber(req, res, next) {
    try {
        const { orderNumber } = req.params;
        const order = await Order.findOne({ orderNumber });
        if (!order) {
            return res.status(404).json({ message: 'Commande introuvable' });
        }
        const { payment, ...safeOrder } = order.toObject();
        return res.status(200).json(safeOrder);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

// GET /api/orders — commandes du client connecté (nécessite requireAuth)
export async function getMyOrders(req, res, next) {
    try {
        const clientId = req.user.clientId?._id ?? req.user.clientId;
        const orders = await Order.find({ clientId })
            .sort({ orderDate: -1 })
            .select('-payment')
            .lean();
        return res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        next(err);
    }
}