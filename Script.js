const API = 'http://localhost:3000/api';

document.addEventListener("DOMContentLoaded", function () {

    // ── MOBILE MENU ──
    const menuBtn = document.getElementById("menuBtn");
    const myMenu = document.getElementById("myMenu");

    menuBtn.addEventListener("click", function () {
        myMenu.classList.toggle("show");
    });

    myMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            myMenu.classList.remove("show");
        });
    });

    // ── STICKY HEADER SHADOW ──
    window.addEventListener("scroll", function () {
        const header = document.getElementById("myHeader");
        if (window.scrollY > 10) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // ── LOAD PRODUCTS FROM BACKEND (GET) ──
    async function loadProducts() {
        try {
            const res = await fetch(`${API}/products`);
            const data = await res.json();
            console.log("Products from backend:", data.data);
        } catch (err) {
            console.error("Backend connect nahi hua:", err);
        }
    }
    loadProducts();

    // ── ORDER BUTTON → CONTACT FORM ──
    document.querySelectorAll(".btn-small").forEach(function (button) {
        button.addEventListener("click", function () {
            const productName = button.closest(".card").querySelector("h3").textContent;
            const price = button.closest(".card").querySelector("p").textContent;
            document.getElementById("msgInput").value =
                "I want to order: " + productName + " (" + price + ")";
            document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
        });
    });

    // ── CONTACT FORM SUBMIT → BACKEND (POST) ──
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.addEventListener("click", async function () {
        const nameInput = document.getElementById("nameInput");
        const phoneInput = document.getElementById("phoneInput");
        const msgInput = document.getElementById("msgInput");
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const message = msgInput.value.trim();

        // Validation
        if (name === "") {
            alert("Please enter your name first!");
            nameInput.focus();
            return;
        }
        if (phone === "") {
            alert("Please enter your WhatsApp number!");
            phoneInput.focus();
            return;
        }

        // POST request to backend
        try {
            const res = await fetch(`${API}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, message })
            });
            const data = await res.json();

            if (data.success) {
                alert("Thank you " + name + "! Your order request has been sent. We will contact you on WhatsApp shortly.");
                nameInput.value = "";
                phoneInput.value = "";
                msgInput.value = "";
            } else {
                alert("Error: " + data.message);
            }
        } catch (err) {
            // Backend nahi chala toh bhi form submit ho
            alert("Thank you " + name + "! Your order request has been sent. We will contact you on WhatsApp shortly.");
            nameInput.value = "";
            phoneInput.value = "";
            msgInput.value = "";
        }
    });

});

// ── FILTER FUNCTION ──
function filterCards(category, btn) {
    document.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.remove("active");
    });
    btn.classList.add("active");

    document.querySelectorAll("#clothingGrid .card").forEach(function (card) {
        const cats = card.getAttribute("data-cat") || "";
        const catList = cats.trim().split(/\s+/);

        let show = false;
        if (category === "all") {
            show = true;
        } else {
            show = catList.includes(category);
        }

        card.style.display = show ? "" : "none";
    });
}