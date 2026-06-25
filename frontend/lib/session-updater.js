let sessionUpdater = null;

export function registerSessionUpdater(updater) {
    sessionUpdater = updater;
}

export async function refreshSession() {
    if (!sessionUpdater) return false;
    try {
        await sessionUpdater();
        return true;
    } catch {
        return false;
    }
}
