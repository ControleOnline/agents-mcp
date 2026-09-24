# Frontend Component Reuse Checklist

Reusable UI patterns should have a canonical `Default<Component>` counterpart.

## Required checks

- [ ] Common inputs reuse or create `DefaultInput`.
- [ ] Common selects reuse or create `DefaultSelect`.
- [ ] Common options reuse or create `DefaultOption`.
- [ ] Common buttons reuse or create `DefaultButton`.
- [ ] Repeated components, fields, controls and actions do not duplicate an
      existing project component.
- [ ] New `Default<Component>` components follow established structure, props,
      theme, accessibility and state behavior.
- [ ] Visual variants use props or composition rather than per-screen copies.
- [ ] Any exception is documented in the task with evidence that the component
      is specific to that use case.
