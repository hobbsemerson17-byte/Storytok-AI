import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  const templates = req.db.getTemplates();
  res.json({ templates });
});

router.get('/:id', (req, res) => {
  const template = req.db.findTemplateById(req.params.id);
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  res.json({ template });
});

export default router;
