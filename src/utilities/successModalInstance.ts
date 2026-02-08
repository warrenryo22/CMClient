type SuccessModalData = {
    message?: string;
    hideDuration?: number;
};

type SuccessModalHandler = (data: SuccessModalData) => void;

class SuccessModalInstance {
    private handler: SuccessModalHandler | null = null;

    setHandler(handler: SuccessModalHandler) {
        this.handler = handler;
    }

    show(data: SuccessModalData) {
        if (this.handler) this.handler(data);
    }
}

const successModalInstance = new SuccessModalInstance();

export default successModalInstance;