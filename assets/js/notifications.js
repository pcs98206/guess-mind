const body = document.querySelector('body');

const fireNotifications = (text, color) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = text;
    notification.style.backgroundColor = color;
    body.appendChild(notification);
};

export const handleNewUser = ({nickname}) => {
    return fireNotifications(`${nickname}님이 로그인했습니다.`, "rgb(0, 122, 255)")
};

export const handleDisconnected = ({nickname}) => {
    return fireNotifications(`${nickname}님이 로그아웃했습니다.`, "rgb(255, 59, 48)")
};