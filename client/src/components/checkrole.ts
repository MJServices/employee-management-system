export async function checkRole() {
    const response = await fetch("/api/v1/user/checkRole");
    const data = await response.json();
    console.log(data);
}