static async getProjectsByUser(req: Request, res: Response) {
        const { id } = req.params

        try {
            const projects = await Project.find({
                where: { users: { id } },
                relations: ['tasks', 'users'],
            })
            if (!projects)
                return res.status(404).json({ error: 'User not found' })
            projects?.map((project) => {
                console.log(project.users)
            })

            // TODO: Find a way to fix this bullshit
            const realProjectsBcsTypeORMSucksIBelieve = await Promise.all(
                projects.map(async (project) => {
                    return await Project.findOne({
                        where: { id: project.id },
                        relations: ['tasks', 'users'],
                    })
                })
            )

            if (!realProjectsBcsTypeORMSucksIBelieve) {
                return res.status(404).json({ error: 'User not found' })
            }

            return res.status(200).json(realProjectsBcsTypeORMSucksIBelieve)
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Failed to fetch projects' })
        }
    }
