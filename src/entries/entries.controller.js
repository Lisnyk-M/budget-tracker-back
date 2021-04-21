const validator = require('../validators/validator');
const entriesSchema = require('../schemas/entries.schema');
const entriesModel = require('./entries.model');
const {ObjectId} = require('mongodb');

class EntriesController {
    async addEntry(req, res, next) {
        try {
            const { date, category, spent } = req.body;
            const userId = req.user._id;

            const notValid = await validator(req.body, entriesSchema);

            if (notValid) {
                return res.status(400).send({ error: notValid });
            }

            const existsDate = await entriesModel.findOne({
                $and: [{ userId }, { date }],
            });

            if (!existsDate) {
                const newEntry = await entriesModel.create({
                    date,
                    userId,
                    entries: [
                        {
                            category,
                            spent,
                        },
                    ],
                });
                return res.status(201).json(newEntry);
            }

            const existsEntry = existsDate.entries.find(
                (item) => item.category === category
            );

            if (!existsEntry) {
                const ration = await entriesModel.findOneAndUpdate(
                    { $and: [{ userId }, { date }] },
                    {
                        $push: {
                            entries: {
                                category,
                                spent,
                            },
                        },
                    },
                    { new: true }
                );

                return res.status(201).json(ration);
            }

            await entriesModel.findOneAndUpdate(
                { $and: [{ userId }, { date }] },
                { $pull: { entries: existsEntry } },
                { new: true },
            )

            const objEntries = { category, spent };

            const updatedEntries = await entriesModel.findOneAndUpdate(
                { $and: [{ userId }, { date }] },
                { $push: { entries: objEntries } },
                { new: true },
            )

            res.status(201).send(updatedEntries);

        }
        catch (err) {
            next(err);
        }
        next();
    }

    async getEntry(req, res, next) {
        try {
            const date = req.params.date;
            const userId = req.user._id;

            const entry = await entriesModel.findOne(
                { $and: [{ userId }, { date }] }
            )

            if (!entry) {
                return res.status(404).send({ message: 'Not found' });
            }

            return res.status(200).send(entry);
        }
        catch (err) {
            next(err);
        }
        next();
    }

    async deletePosition(req, res, next) {
        try {
            const date = req.params.date;
            const userId = req.user._id;
            const id = ObjectId(req.body.id);

            const entry = await entriesModel.findOne(
                { $and: [{ userId }, { date }] }
            )

            if (!entry) {
                return res.status(404).send({ message: 'Not found' });
            }

            const existsEntry = entry.entries.find(
                (item) => {
                    console.log('item._id, id: ', item._id, id)
                    return  req.body.id == item._id
                }
            );

            if (!existsEntry) {
                return res.status(404).send('position not found');
            }

            const upd = await entriesModel.findOneAndUpdate(
                { $and: [{ userId }, { date }] },
                { $pull: { entries: existsEntry } },
                { new: true },
            )
            return res.status(201).send(upd);
            
        }
        catch (err) {
            next(err);
        }
        next();
    }

    async getPosition (req, res, next) {
        try {
            const date = req.params.date;
            const userId = req.user._id;
            const id = ObjectId(req.body.id);

            const entry = await entriesModel.findOne(
                { $and: [{ userId }, { date }] }
            )

            if (!entry) {
                return res.status(404).send({ message: 'Not found' });
            }

            const existsEntry = entry.entries.find(
                (item) => {
                    console.log('item._id, id: ', item._id, id)
                    return  req.body.id == item._id
                }
            );

            console.log('existsEntry: ', existsEntry)

            if (!existsEntry) {
                return res.status(404).send('position not found');
            }

            return res.status(201).send(existsEntry);
        }
        catch(err){
            next(err);
        }
        next();
    }
}

module.exports = new EntriesController();