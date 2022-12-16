import { Request, Response } from 'express';

const addInventory = (req: Request, res: Response) => {
    try {
        //TODO: finish once database is set up
        console.log(req.body.inventory);
        res.send('Inventory Added');
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: `There was an error adding inventory: ${req.body.inventory.companyName}` })
    }
};

export default addInventory;