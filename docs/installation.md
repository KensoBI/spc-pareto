# Installation

## From the Grafana Plugin Catalog

The recommended way to install SPC Pareto:

1. In Grafana, navigate to **Administration > Plugins**
2. Search for **SPC Pareto**
3. Click **Install**

The plugin is available immediately — no restart required.

## Using the Grafana CLI

```bash
grafana cli plugins install kensobi-spcpareto-panel
```

After installation, restart the Grafana server:

```bash
# systemd
sudo systemctl restart grafana-server

# Docker
docker restart grafana
```

## Docker / Docker Compose

Add the plugin to the `GF_INSTALL_PLUGINS` environment variable:

```yaml
services:
  grafana:
    image: grafana/grafana:latest
    environment:
      GF_INSTALL_PLUGINS: kensobi-spcpareto-panel
```

## Manual Installation

1. Download the latest release from the [GitHub releases page](https://github.com/kensobi/spc-pareto/releases)
2. Extract the archive into your Grafana plugins directory:
   ```bash
   unzip kensobi-spcpareto-panel-<version>.zip -d /var/lib/grafana/plugins/
   ```
3. Restart the Grafana server

> **Note:** For unsigned plugins, you may need to add the plugin ID to Grafana's `allow_loading_unsigned_plugins` configuration:
> ```ini
> [plugins]
> allow_loading_unsigned_plugins = kensobi-spcpareto-panel
> ```

## Requirements

- Grafana **12.3** or later
- No backend dependencies — the plugin runs entirely in the browser
