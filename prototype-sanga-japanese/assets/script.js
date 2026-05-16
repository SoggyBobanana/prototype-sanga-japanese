import { initializeApp } from
"https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";

const { getFirestore, collection, addDoc, getDocs, deleteDoc} from
"https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD8sXo9l3n1m5u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x8y9z0a1b2c3d4e5f6
    authDomain: "customer-management-12345.firebaseapp.com",
    projectId: "customer-management-12345",

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadMenu() {
    const querySnapshot = await getDocs(collection(db, "menu"));

    querySnapshot.forEach((doc) => {
        const data = doc.data();

        console.log(data);
    });
}

loadMenu();

const menuDiv = document.getElementById('menu');

async function loadMenu() {
    const querySnapshot = await getDocs(collection(db, "menu"));

    querySnapshot.forEach((doc) => {
        const data = doc.data();

        menuDiv.innerHTML += `
            <div class="menu-item">
                <h3>${data.name}</h3>
                <p>Price: $${data.price}</p>
                <p>Rating: ${data.rating} stars</p>
                <p>${data.description}</p>
            </div>
        `;
    }
    );
}

loadMenu();

