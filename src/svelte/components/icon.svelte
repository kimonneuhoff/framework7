<script>
  import { DEFAULT_STYLE, Icon as CelestialIcon, iconMap } from 'celestial';
  import { colorClasses } from '../shared/mixins.js';
  import { classNames } from '../shared/utils.js';
  import { useTooltip } from '../shared/use-tooltip.js';
  import { useTheme } from '../shared/use-theme.js';

  const legacyIconAliases = {
    add: 'plus-large',
    arrow_up_circle_fill: 'send',
    attach_money: 'currency-dollar',
    camera: 'camera1',
    camera_alt: 'camera1',
    close: 'x',
    gear: 'settings-gear1',
    home: 'home',
    house_fill: 'home',
    info: 'circle-info',
    info_circle_fill: 'circle-info',
    info_outline: 'circle-info',
    person: 'user',
    person_fill: 'user',
    plus: 'plus-large',
    send: 'send',
    settings: 'settings-gear1',
    square_list_fill: 'list-bullets',
    view_list: 'list-bullets',
    volume_mute: 'volume-off',
    volume_up: 'volume-up',
    xmark: 'x',
  };

  let {
    class: className,
    style = undefined,
    material = undefined,
    f7 = undefined,
    icon = undefined,
    ios = undefined,
    md = undefined,
    tooltip = undefined,
    tooltipTrigger = undefined,
    size = undefined,
    children,
    ...restProps
  } = $props();

  let el = $state(null);
  let theme = useTheme((t) => {
    theme = t;
  });

  function stripIconPrefix(value) {
    if (typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const parts = trimmed.split(':');
    if (parts.length > 1 && ['material', 'f7', 'icon'].includes(parts[0])) {
      return parts.slice(1).join(':');
    }
    return trimmed;
  }

  function getMappedIconName(value) {
    const stripped = stripIconPrefix(value);
    if (!stripped) return undefined;

    const directCandidates = [stripped, stripped.replace(/_/g, '-')];
    for (const candidate of directCandidates) {
      if (iconMap.has(`${candidate}:${DEFAULT_STYLE}`)) return candidate;
    }

    const alias =
      legacyIconAliases[stripped] || legacyIconAliases[stripped.replace(/-/g, '_')] || legacyIconAliases[stripped.replace(/_/g, '-')];
    if (alias && iconMap.has(`${alias}:${DEFAULT_STYLE}`)) return alias;

    return undefined;
  }

  const themeIcon = $derived.by(() => {
    if (theme?.ios && ios) return ios;
    if (theme?.md && md) return md;
    return undefined;
  });

  const resolvedIconName = $derived.by(() => {
    const candidates = [themeIcon, icon, material, f7];
    for (const candidate of candidates) {
      const resolved = getMappedIconName(candidate);
      if (resolved) return resolved;
    }
    return undefined;
  });

  const iconClasses = $derived(classNames(className, 'icon', colorClasses(restProps)));

  const iconSize = $derived(
    typeof size === 'number' || parseFloat(size) === size * 1 ? `${size}px` : size,
  );

  const iconStyle = $derived(
    (style || '') +
      (iconSize
        ? `;font-size: ${iconSize}; width: ${iconSize}; height: ${iconSize}`.replace(';;', '')
        : ''),
  );
</script>

<span
  style={iconStyle}
  class={iconClasses}
  bind:this={el}
  {...restProps}
  use:useTooltip={{ tooltip, tooltipTrigger }}
>
  {#if resolvedIconName}
    <CelestialIcon
      name={resolvedIconName}
      size=""
      color=""
      class="framework7-imagine-icon"
      decorative={true}
    />
  {/if}
  {@render children?.()}
</span>

<style>
  .icon {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :global(.framework7-imagine-icon) {
    width: 100%;
    height: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :global(.framework7-imagine-icon svg) {
    width: 100%;
    height: 100%;
  }
</style>
