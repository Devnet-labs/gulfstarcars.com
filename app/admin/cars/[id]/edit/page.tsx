import { prisma } from '@/lib/db';
import { updateCar } from '../../actions';
import CarForm from '@/components/admin/CarForm';
import { notFound } from 'next/navigation';

interface EditCarPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditCarPage({ params }: EditCarPageProps) {
    const { id } = await params;
    const car = await prisma.car.findUnique({
        where: { id },
    });

    if (!car) {
        notFound();
    }

    const initialData = {
        ...car,
    };

    const updateCarWithId = updateCar.bind(null, car.id);

    return (
        <CarForm
            initialData={initialData}
            action={updateCarWithId}
            title="Edit Car"
        />
    );
}
