# How to setup Google Sheet API

## Create a Google Cloud project

  1. Open the [Google Cloud console](https://console.cloud.google.com).
  1. At the top-left, click burger Menu > **IAM & Admin** > **Create a Project**.
  1. In the Project Name field, enter a descriptive name for your project.
  1. In the Location field, click Browse to display potential locations for your project. Then, click Select.
  1. Click Create. The console navigates to the Dashboard page and your project is created within a few minutes.

## Enable Google Google Sheet API

  1. Open the [Google Cloud console](https://console.cloud.google.com).
  1. At the top-left, click burger Menu > **APIs & Services** > **Library**.
  1. In the list of API, click the **Google Sheets API** tile.
  1. Click Enable.

## Create access credentials
### Create a service account

  1. Open the [Google Cloud console](https://console.cloud.google.com).
  1. At the top-left, click burger Menu > **IAM & Admin** > **Service Accounts**.
  1. Click **+Create service account**.
  1. Fill in the service account details, then click **Create and continue**.
  1. Click **Continue**.
  1. Click **Done**.

### Create credentials for a service account

  1. In the **Service Accounts** page, click on **Actions** > **Manage keys**
  1. On the **Keys** page click **Add keys** > **Create new key**.
  1. Select **JSON**, then click **Create**.
  1. *Key file should be downloaded at this moment*. Click **Close**.