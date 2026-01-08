

## [rootRouteTrees.tsx](./rootRouteTrees.tsx)

**What is it?** 

Collects the routes from the other parts of the application and exposes two functions to return an array of [RouteObject](https://reactrouter.com/start/data/route-object) ([source](https://github.com/remix-run/react-router/blob/32d759958978b9fbae676806dd6c84ade9866746/packages/react-router/lib/context.ts#L67)) instances for component trees that will render at the “base level” (underlay) and those that will render at the "overlay level.”  Recall that at its core, a RouteObject *usually* contains the following in its structure, though this is *not exhaustive*.

| **Property**        | **Description**                                              |
| ------------------- | ------------------------------------------------------------ |
| `path`              | The URL segment (e.g., `"dashboard"` or `":id"`).            |
| `element`           | The React component to render (usually JSX).                 |
| `children`          | An array of nested route objects.                            |
| `loader` / `action` | Functions for data loading and form submissions (Data Router APIs). |
| `errorElement`      | A component to render if an error crashes this route.        |

**Where is it used?**

See [RouteTree](#routetree).

## <a name='routetree'>RouteTree.tsx</a> ([source](./RouteTree.tsx))

Used by [RouteTree.tsx](./RouteTree.tsx) to create a component consisting of underlay and overlay routes.  Here is a breakdown of what [useRoutes](https://reactrouter.com/api/hooks/useRoutes) does.

- **Takes `RouteObject` instances:** `RouteTree` calls `getAppRouteTree()` to fetch the raw array of route definitions (the "blueprint").
- **Turns them into React Elements:** The `useRoutes` hook takes that blueprint, runs logic to see what matches the current location, and produces the valid React Element (the "UI").
- **Returns a component that matches the route:** It doesn't render *all* the routes at once. It returns a component containing *only* the **active/matched** routes.  If your `RouteObject` array has 50 possible pages, `useRoutes` doesn't convert all 50 into elements. It acts as a **filter**:
  1. **Input:** 50 Route Objects (Data) + Current URL.
  2. **Process:** Find the 1 that matches.
  3. **Output:** The React Element for just that **1 active page** (e.g., `<Login />`).

**Why `useRoutes` is called twice**

```typescript
// 1. Calculates the main UI (e.g., The Dashboard) based on the 'underlay' location
const appTreeRoutes = useRoutes(getAppRouteTree(), locationState.underlay);

// 2. Calculates a modal/popup (e.g., A Settings Modal) based on the 'overlay' location
const overlayTreeRoutes = useRoutes(getAppRouteTreeOverlay(), locationState.overlay);
```

The `RouteTree` component then returns a **Fragment** that stacks these two results together:

```typescript
return (
   <>
      {appTreeRoutes}      {/* The bottom layer (Page) */}
      {overlayTreeRoutes}  {/* The top layer (Modal/Popup) */}
   </>
);
```

So `RouteTree` isn't just a standard router; it is a **layout manager** that composes *two potentially independent navigation stacks* (main app + overlays) onto the screen simultaneously.

**Underlay and Overlay**

`locationState.underlay` vs `locationState.overlay` allows you to open a modal while keeping the URL of the background page active.  This is a powerful pattern often called **"Background Location"** or **"Pinterest-style" routing**. 

> It allows you to change the URL (so it's shareable) without unmounting the page behind the modal.

The "magic" happens because `useRoutes` supports a second argument (the `location` override).

```typescript
// 1. Calculates the main UI (e.g., The Dashboard) based on the 'underlay' location
const appTreeRoutes = useRoutes(getAppRouteTree(), locationState.underlay);

// 2. Calculates a modal/popup (e.g., A Settings Modal) based on the 'overlay' location
const overlayTreeRoutes = useRoutes(getAppRouteTreeOverlay(), locationState.overlay);
```

Here is how `locationState.underlay` and `locationState.overlay` manipulate what the user sees.

### The Scenario: A "Colors" App

Imagine you are on a page listing colors (`/colors`). You click on "Red". You want the URL to become `/colors/red` and a modal to open showing Red details, but you want the **list of colors to stay visible in the background**.

[CONTINUE HERE](https://gemini.google.com/app/b284a25d89142eb4)