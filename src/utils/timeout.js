export default function timeout(miliseconds) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, miliseconds);
    });
}
