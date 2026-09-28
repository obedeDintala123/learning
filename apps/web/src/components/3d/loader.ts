export function updateLoader(progress: ProgressEvent, container: HTMLElement) {
  const percentageElement = container.querySelector('#loader-progress')
  const messageElement = container.querySelector('#loader-message')
  const bar = container.querySelector('#loader-bar')

  if (!progress.total) {
    if (percentageElement) percentageElement.textContent = '...'
    return;
  }

  const percentage = Math.min(100, (progress.loaded / progress.total) * 100);

  if (percentageElement) {
    percentageElement.textContent = percentage >= 100 ? '...' : `${Math.round(percentage)}%`
  }
  if (messageElement && percentage >= 100) {
    messageElement.textContent = 'Preparando modelo 3D'
  }
  if (bar instanceof HTMLElement) bar.style.width = `${percentage}%`
}

export function showLoaderError(container: HTMLElement) {
  const message = container.querySelector('#loader-message')
  const progress = container.querySelector('#loader-progress')
  const spinner = container.querySelector('#loader-spinner')
  const element = container.querySelector('#model-loader')

  if (message) message.textContent = 'Não foi possível carregar o modelo'
  progress?.remove()
  spinner?.remove()
  element?.setAttribute('role', 'alert')
  element?.removeAttribute('aria-live')
}