const deleteProduct = (btn) => {
    const productId = btn.parentNode.querySelector('[name="productId"]').value;
    const csrf = btn.parentNode.querySelector('[name="_csrf"]').value;

    fetch(`/admin/product/${productId}`, {
        method: "DELETE",
        headers: {
            'csrf-token': csrf
        }
    }).then(res => {
        return res.json();

    }).then(data => {
        if (data.success === 1) {
            btn.closest('article').remove();
        } else {
            alert(data.message);
        }
    }).catch(err => {
        console.log(err);
    });
}