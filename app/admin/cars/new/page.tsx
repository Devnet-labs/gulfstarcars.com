import { createCar } from '../actions';
import CarForm from '@/components/admin/CarForm';

export default function NewCarPage() {
    return (
        <CarForm action={createCar} title="Add New Car" />
    );
}
