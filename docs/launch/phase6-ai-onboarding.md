# Phase 7: AI Onboarding (Future Enhancement)

## Status: Post-Launch

This phase will be implemented after the initial launch to improve onboarding speed.

---

## Goal

Reduce onboarding time from 15+ minutes to under 2 minutes using AI.

---

## Requirements

### AI Service Generator

**Input:** Business type, business name
**Output:** 3-5 services with name, duration, price, description

```
User selects: "Wellness Practitioner"
AI generates:
- Craniosacral Therapy (90 min, €85)
- Inner Journey Session (120 min, €110)
- Creative Workshop (180 min, €75)
```

---

### AI Description Generator

**Input:** Business type, business name
**Output:** Professional 2-sentence description

---

### Smart Defaults

Pre-fill working hours based on business type (no AI needed):
- Wellness: Mon-Fri 10:00-18:00
- Beauty: Tue-Sat 9:00-19:00

---

### New Onboarding Flow

1. Select business type (existing)
2. AI generates page (loading screen)
3. Review & edit (all suggestions editable)
4. Create account (existing)

---

## Technical Requirements

- OpenAI API integration (GPT-4o-mini)
- New backend `/api/ai/*` endpoints
- Frontend loading states
- Fallback for API failures

---

## Success Criteria

- [ ] AI generates relevant services
- [ ] User can edit all suggestions
- [ ] Onboarding < 2 minutes
- [ ] Fallback if AI fails
