import express from 'express';
import {
    getAllSBUs,
    getSBUById,
    createSBU,
    updateSBU,
    deleteSBU,
} from '../controllers/sbuController.js';
const router = express.Router();


router.post('/', createSBU);
router.get('/', getAllSBUs);
router.get('/:id', getSBUById);
router.put('/:id', updateSBU);
router.delete('/:id', deleteSBU);

export default router;
